import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import EntryID "mo:core/Nat";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type VisitorRecord = {
    fullName : Text;
    email : Text;
    address : Text;
    jobInfo : Text;
    incomeLevel : Text;
    reasonForVisit : Text;
    visitType : Text;
    timestamp : Int;
  };

  module VisitorRecord {
    public func compare(record1 : VisitorRecord, record2 : VisitorRecord) : Order.Order {
      Text.compare(record1.fullName, record2.fullName);
    };
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Persistent storage for visitor records
  var nextEntryId = 0;
  let visitorRecords = Map.empty<EntryID.Nat, VisitorRecord>();

  // Public visitor entry - accessible to everyone including guests
  public shared ({ caller }) func addVisitorRecord(
    fullName : Text,
    email : Text,
    address : Text,
    jobInfo : Text,
    incomeLevel : Text,
    reasonForVisit : Text,
    visitType : Text,
  ) : async () {
    let timestamp = Time.now();
    let record = {
      fullName;
      email;
      address;
      jobInfo;
      incomeLevel;
      reasonForVisit;
      visitType;
      timestamp;
    };

    visitorRecords.add(nextEntryId, record);
    nextEntryId += 1;
  };

  public type EntryIdVisitorRecord = {
    id : EntryID.Nat;
    record : VisitorRecord;
  };

  module EntryIdVisitorRecord {
    public func compareByTimestamp(a : EntryIdVisitorRecord, b : EntryIdVisitorRecord) : Order.Order {
      if (a.record.timestamp < b.record.timestamp) {
        #less;
      } else if (a.record.timestamp > b.record.timestamp) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  // Public query - accessible to everyone to view visitor records
  public query ({ caller }) func getSortedVisitorRecords() : async [EntryIdVisitorRecord] {
    visitorRecords.entries().toArray().map(
      func((id, record)) {
        { id; record };
      }
    ).sort(EntryIdVisitorRecord.compareByTimestamp);
  };

  // Admin login with password authentication
  public shared ({ caller }) func adminLogin(password : Text) : async Bool {
    // Check if already admin
    if (AccessControl.isAdmin(accessControlState, caller)) {
      return true;
    };
    
    // Verify password
    if (password == "9533") {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      true;
    } else {
      Runtime.trap("Login failed: Incorrect password");
    };
  };

  // Export function - admin only
  public query ({ caller }) func exportVisitorRecords() : async [EntryIdVisitorRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can export records");
    };
    visitorRecords.entries().toArray().map(
      func((id, record)) {
        { id; record };
      }
    ).sort(EntryIdVisitorRecord.compareByTimestamp);
  };
};
