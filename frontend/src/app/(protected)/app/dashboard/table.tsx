import { Badge } from "@/components/ui/badge";
import { fetchUsersList } from "@/data/user";
import { PersonIcon } from "@radix-ui/react-icons";

export default async function UsersTable() {
  const users = await fetchUsersList();

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <table className="bg-zinc w-full text-left text-sm text-gray-500 rtl:text-right">
          <thead className="bg-zinc-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Sign in count
              </th>
              <th scope="col" className="px-6 py-3">
                Sign up timestamp
              </th>
              <th scope="col" className="px-6 py-3">
                Sign out timestamp
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users?.length == 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-3 text-center">
                  No data found
                </td>
              </tr>
            )}
            {users?.map((user) => (
              <tr key={user.id}>
                <th
                  scope="row"
                  className="flex items-center gap-x-2 whitespace-nowrap px-6 py-4 font-medium text-gray-900"
                >
                  <PersonIcon className="size-4" />
                  {user.username}
                </th>
                <td className="px-6 py-4">
                  {" "}
                  <Badge variant="outline">{user.signInCount} times</Badge>
                </td>
                <td className="flex items-center gap-x-2 px-6 py-4">
                  {new Date(user.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  {user.lastLogout
                    ? new Date(user.lastLogout).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
