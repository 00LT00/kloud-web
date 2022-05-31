/// <reference types="vite/client" />
interface IUser {
  id: string;
  username: string;
  phone?: string;
  email?: string;
  role: 'admin' | 'user' | 'root';
}

interface IResource {
  resource_id: string;
  name: string;
  folder: string;
  type: string;
  config: Record<string, unknown>;
}

interface IFlow {
  FlowID: string;
  ApplicantID: string;
  ResourceID: string;
  Statue: 'pending' | 'pass' | 'fail';
  ApproverID: string;
  AppID: string;
  Config: string;
  Reason: string;
}

interface IApp {
  AppID: string;
  Config: string;
  CreatedAt: string;
  Name: string;
  ResourceID: string;
  UpdatedAt: string;
  UserID: string;
}
