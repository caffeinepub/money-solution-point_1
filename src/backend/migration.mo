import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

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

  // Old actor stores records in unstable/non-persistent var
  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    visitorRecords : Map.Map<Nat, VisitorRecord>;
    nextEntryId : Nat;
  };

  // New actor stores records in persistent stable var
  type NewActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    visitorRecords : Map.Map<Nat, VisitorRecord>;
    nextEntryId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
