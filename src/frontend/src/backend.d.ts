import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface EntryIdVisitorRecord {
    id: Nat;
    record: VisitorRecord;
}
export type Nat = bigint;
export interface VisitorRecord {
    reasonForVisit: string;
    jobInfo: string;
    visitType: string;
    fullName: string;
    email: string;
    address: string;
    timestamp: bigint;
    incomeLevel: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addVisitorRecord(fullName: string, email: string, address: string, jobInfo: string, incomeLevel: string, reasonForVisit: string, visitType: string): Promise<void>;
    adminLogin(password: string): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    exportVisitorRecords(): Promise<Array<EntryIdVisitorRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSortedVisitorRecords(): Promise<Array<EntryIdVisitorRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
