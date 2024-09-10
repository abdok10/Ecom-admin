import { UserButton } from "@clerk/nextjs";

export default function SetupPage() {
  return (
    <div>
      <p>Dashboard</p>
      <UserButton />
    </div>
  );
}
