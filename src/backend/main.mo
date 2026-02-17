import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import EntryID "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Use migration function via "with" clause.
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextEntryId = 0;
  let visitorRecords = Map.empty<EntryID.Nat, VisitorRecord>();

  // Admin password now persisted in stable state through migration code.
  // Default is "9533", but migration preserves existing passwords.
  var adminPassword : Text = "9533";

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

  public shared ({ caller }) func addVisitorRecord(
    fullName : Text,
    email : Text,
    address : Text,
    jobInfo : Text,
    incomeLevel : Text,
    reasonForVisit : Text,
    visitType : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add visitor records");
    };

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

  public shared ({ caller }) func unlockAdminPrivileges(password : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unlock admin privileges");
    };

    if (password == adminPassword) {
      AccessControl.assignRole(accessControlState, caller, caller, #admin);
      true;
    } else {
      false;
    };
  };

  public shared ({ caller }) func changeAdminPassword(oldPassword : Text, newPassword : Text) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can change the password");
    };

    if (oldPassword != adminPassword) {
      return false;
    };

    adminPassword := newPassword;
    true;
  };

  public shared query ({ caller }) func getSortedVisitorRecords() : async [EntryIdVisitorRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    visitorRecords.entries().toArray().map(
      func((id, record)) {
        { id; record };
      }
    ).sort(EntryIdVisitorRecord.compareByTimestamp);
  };

  public shared query ({ caller }) func exportVisitorRecords() : async [EntryIdVisitorRecord] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    visitorRecords.entries().toArray().map(
      func((id, record)) {
        { id; record };
      }
    ).sort(EntryIdVisitorRecord.compareByTimestamp);
  };

  public shared ({ caller }) func updateVisitorRecord(
    recordId : EntryID.Nat,
    fullName : Text,
    email : Text,
    address : Text,
    jobInfo : Text,
    incomeLevel : Text,
    reasonForVisit : Text,
    visitType : Text,
  ) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let timestamp = Time.now();
    let updatedRecord = {
      fullName;
      email;
      address;
      jobInfo;
      incomeLevel;
      reasonForVisit;
      visitType;
      timestamp;
    };

    switch (visitorRecords.get(recordId)) {
      case (null) {
        Runtime.trap("Update failed: Record not found");
      };
      case (?_existingRecord) {
        visitorRecords.add(recordId, updatedRecord);
      };
    };
  };
};
