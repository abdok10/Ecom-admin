import { UserButton } from "@clerk/nextjs";
import MainNav from "./MainNav";

const Navbar = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div>Store Switcher</div>
        <MainNav className="px-6" />
        <div className="ml-auto flex items-center gap-4">
          <UserButton />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
