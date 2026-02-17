import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

module {
  type VisitorRecord = {
    fullName : Text;
    email : Text;
    address : Text;
    jobInfo : Text;
    incomeLevel : Text;
    reasonForVisit : Text;
    visitType : Text;
    timestamp : Int;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    visitorRecords : Map.Map<Nat, VisitorRecord>;
    nextEntryId : Nat;
    adminPassword : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    visitorRecords : Map.Map<Nat, VisitorRecord>;
    nextEntryId : Nat;
    adminPassword : Text;
  };

  public func run(old : OldActor) : NewActor {
    // Preserve existing password during upgrades, unless it's the old default "MSP9533"
    // If empty string (fresh deployment), initialize to "9533"
    let adminPassword = if (old.adminPassword == "" or old.adminPassword == "MSP9533") {
      "9533";
    } else {
      old.adminPassword;
    };

    {
      old with
      adminPassword;
    };
  };
};
