import { ActionFunction, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Check, Edit2, Flag, Instagram, Mail, Phone, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { API_BASE_URL } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { fetchWithAuth } from "~/lib/api.server";
import { cn } from "~/lib/utils";

interface ProfileData {
  coverImageUrl?: string;
  profileImageUrl?: string;
  name?: string;
  location?: string;
  aboutMe?: string;
  phoneNumber?: string;
  email: string;
  instagram: string;
}

// -- Loader and Action --
export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  try {
    let profileData = (await fetchWithAuth(`${API_BASE_URL}/users/me`, request)) as ProfileData;
    return profileData;
  } catch (error) {
    console.log(error);
    return redirect("/logout");
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // Build the updated profile data from the form values.
  let updatedProfile: ProfileData = {
    name: formData.get("name") as string,
    location: formData.get("location") as string,
    aboutMe: formData.get("aboutMe") as string,
    phoneNumber: formData.get("phoneNumber") as string,
    email: formData.get("email") as string,
    instagram: formData.get("instagram") as string,
    profileImageUrl: formData.get("profileImage") as string,
    coverImageUrl: formData.get("coverImage") as string,
  };

  updatedProfile = (await fetchWithAuth(
    `${API_BASE_URL}/users/me`,
    request,
    {
      method: 'POST',
      body: JSON.stringify(updatedProfile)
    }
  )) as ProfileData;

  return updatedProfile;
};

// -- Component --

export default function ProfileMePage() {
  // Get the initial profile data from the loader.
  const loaderData = useLoaderData<ProfileData>();

  // Local state to manage editing.
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<ProfileData>(loaderData);
  const transition = useTransition();

  const actionData = useActionData<typeof action>();

  const { toast } = useToast()
  useEffect(() => {
    toast({
      variant: "default",
      title: "Updated",
      description: "User profile updated",
    });
    setIsEditing(false);
  }, [actionData])

  // Toggle edit mode. When cancelling, we reset the state.
  const handleEditToggle = () => {
    if (isEditing) {
      setTempData(loaderData);
    }
    setIsEditing(!isEditing);
  };

  // Update local state when inputs change.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempData({ ...tempData, [name]: value });
  };

  return (
    <div className="px-10 py-4 flex items-center flex-col">
      {/* Profile Images */}
      <div className="relative w-full max-w-6xl">
        <img
          alt="profile-cover"
          className="w-full h-[200px] object-cover rounded-xl"
          src={tempData.coverImageUrl}
        />
        <img
          alt="profile-pic"
          className="absolute left-8 top-[100px] w-[200px] h-[200px] rounded-full object-cover border-[4px] border-solid border-white"
          src={tempData.profileImageUrl}
        />
      </div>

      <div className="w-full px-8 max-w-6xl mt-[120px]">
        {isEditing ? (
          // When editing, wrap the fields in a Remix Form so that submitting calls the action.
          <Form method="post">
            <div className="flex justify-between items-center">
              <div>
                {/* Name (editable) */}
                <div className="mb-4">
                  <Input
                    name="name"
                    value={tempData.name}
                    onChange={handleChange}
                    className="text-2xl font-bold"
                  />
                </div>
                {/* Location */}
                <div className="flex items-center gap-2 mb-6 text-gray-600">
                  <Flag className="h-4 w-4" />
                  <div className="flex gap-2">
                    <Input
                      name="location"
                      value={tempData.location}
                      onChange={handleChange}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>

              {/* Form action buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="icon" type="button" onClick={handleEditToggle}>
                  <X className="h-4 w-4" />
                </Button>
                <Button size="icon" type="submit" disabled={transition.state === "submitting"}>
                  <Check className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* About section */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Sobre mí:</h2>
              <Textarea
                name="aboutMe"
                value={tempData.aboutMe}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <Separator className="my-14" />

            {/* Contact information */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-x-2 gap-4">
              <div className={cn("flex items-center gap-2 p-3", "border")}>
                <Phone className="h-5 w-5 text-gray-500" />
                <Input
                  name="phoneNumber"
                  value={tempData.phoneNumber}
                  onChange={handleChange}
                  className="flex-1"
                />
              </div>

              <div className={cn("flex items-center gap-2 p-3", "border")}>
                <Mail className="h-5 w-5 text-gray-500" />
                <Input
                  name="email"
                  value={tempData.email}
                  onChange={handleChange}
                  className="flex-1"
                  type="email"
                />
              </div>

              <div className={cn("flex items-center gap-2 p-3", "border")}>
                <Instagram className="h-5 w-5 text-gray-500" />
                <Input
                  name="instagram"
                  value={tempData.instagram}
                  onChange={handleChange}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Include non-editable values as hidden inputs */}
            <input type="hidden" name="profileImage" value={tempData.profileImageUrl} />
            <input type="hidden" name="coverImage" value={tempData.coverImageUrl} />
          </Form>
        ) : (
          // Read-only view.
          <div>
            <div className="flex justify-between items-center">
              <div>
                {/* Name */}
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">{tempData.name}</h1>
                </div>
                {/* Location */}
                <div className="flex items-center gap-2 mb-6 text-gray-600">
                  <Flag className="h-4 w-4" />
                  <span>
                    {tempData.location}
                  </span>
                </div>
              </div>
              <div>
                <Button variant="outline" size="icon" type="button" onClick={handleEditToggle}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator className="my-8" />

            {/* About section */}
            <div className="mb-6">
              <h2 className="font-semibold mb-2">Sobre mí:</h2>
              <div className="space-y-4 text-gray-700">
                <p>{tempData.aboutMe}</p>
              </div>
            </div>

            <Separator className="my-14" />

            {/* Contact information */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-x-2 gap-4">
              <div className={cn("flex items-center gap-2 p-3")}>
                <Phone className="h-5 w-5 text-gray-500" />
                <span>{tempData.phoneNumber}</span>
              </div>
              <div className={cn("flex items-center gap-2 p-3")}>
                <Mail className="h-5 w-5 text-gray-500" />
                <span>{tempData.email}</span>
              </div>
              <div className={cn("flex items-center gap-2 p-3")}>
                <Instagram className="h-5 w-5 text-gray-500" />
                <span>{tempData.instagram}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}