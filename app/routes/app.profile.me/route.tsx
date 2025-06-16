import { ActionFunction, LoaderFunction, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Camera, Check, Edit2, Flag, Instagram, Mail, Phone, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { API_BASE_URL } from "~/api/config";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/hooks/use-toast";
import { fetchWithAuth } from "~/lib/api.server";
import { cn } from "~/lib/utils";
import defaultProfileImg from "~/assets/default_profile_img.png";
import defaultCoverImg from "~/assets/default_cover_img.png";

interface ProfileData {
  coverImageUrl?: string;
  profileImageUrl?: string;
  name?: string;
  location?: string;
  aboutMe?: string;
  phoneNumber?: string;
  email: string;
  instagram: string;

  profileImageFile: File | null | undefined;
  coverImageFile: File | null | undefined;
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

  // 1) dump formData into a plain object
  const data = Object.fromEntries(formData.entries()) as Record<
    | "name"
    | "location"
    | "aboutMe"
    | "phoneNumber"
    | "email"
    | "instagram"
    | "profileImage"
    | "coverImage"
    | "profileImageFile"
    | "coverImageFile",
    string | File
  >;

  // 2) pick off exactly the two Files and two existing URLs
  const {
    profileImageFile: rawProfileFile,
    coverImageFile: rawCoverFile,
    profileImage: existingProfileUrl,
    coverImage: existingCoverUrl,
    ...textFields
  } = data;

  // 3) helper: upload & return the new URL
  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file, file.name);
    // fetchWithAuth here returns the parsed JSON, not a Response
    const resp = (await fetchWithAuth(
      `${API_BASE_URL}/resources/upload-image`,
      request,
      { method: "POST", body: fd }
    )) as { url: string };
    return resp.url;
  }

  // 4) decide on final URLs
  const profileImageUrl =
    rawProfileFile instanceof File && rawProfileFile.size > 0
      ? await uploadFile(rawProfileFile)
      : (existingProfileUrl as string);

  const coverImageUrl =
    rawCoverFile instanceof File && rawCoverFile.size > 0
      ? await uploadFile(rawCoverFile)
      : (existingCoverUrl as string);

  // 5) rebuild the payload
  const updatedPayload: ProfileData = {
    // spread your text fields (name, location, aboutMe, etc)
    ...(textFields as Pick<
      ProfileData,
      | "name"
      | "location"
      | "aboutMe"
      | "phoneNumber"
      | "email"
      | "instagram"
    >),
    profileImageUrl,
    coverImageUrl,
    profileImageFile:
      rawProfileFile instanceof File ? rawProfileFile : null,
    coverImageFile:
      rawCoverFile instanceof File ? rawCoverFile : null,
  };

  // 6) send the update
  const result = (await fetchWithAuth(
    `${API_BASE_URL}/users/me`,
    request,
    {
      method: "POST",
      body: JSON.stringify(updatedPayload),
      headers: { "Content-Type": "application/json" },
    }
  )) as ProfileData;

  return result;
};

// -- Component --

export default function ProfileMePage() {
  // Get the initial profile data from the loader.
  const loaderData = useLoaderData<ProfileData>();

  // Local state to manage editing.
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<ProfileData>(loaderData);
  //const transition = useTransition();

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


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profileImageUrl" | "coverImageUrl") => {
    const file = e.target.files?.[0]
    if (file) {
      const fileKey = type === 'profileImageUrl' ? 'profileImageFile' : 'coverImageFile';
      tempData[fileKey] = file;

      // Clean up previous object URL to prevent memory leaks
      if (tempData[type]?.startsWith("blob:")) {
        URL.revokeObjectURL(tempData[type])
      }

      const imageUrl = URL.createObjectURL(file)
      setTempData({ ...tempData, [type]: imageUrl })

      // Show visual feedback
      const toast = document.createElement("div")
      toast.textContent = "Image selected! Click save to apply changes."
      toast.className = "fixed bottom-4 right-4 bg-black text-white p-3 rounded-md shadow-lg"
      document.body.appendChild(toast)
      setTimeout(() => document.body.removeChild(toast), 3000)
    }
  }

  return (
    <div className="px-10 py-4 flex items-center flex-col">
      <Form method="post" className="w-full flex flex-col items-center"encType="multipart/form-data" >
        {/* Profile Images */}
        <div className="relative w-full max-w-6xl">
          <img
            alt="profile-cover"
            className="w-full h-[200px] object-cover rounded-xl"
            src={tempData.coverImageUrl || defaultCoverImg}
          />
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-opacity hover:bg-opacity-70">
              <Camera className="h-8 w-8 text-white" />
              <span className="sr-only">Upload cover picture</span>
              <input
                name="coverImageFile"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "coverImageUrl")}
              />
            </label>
          )}

          <img
            alt="profile-pic"
            className="absolute left-8 top-[100px] w-[200px] h-[200px] rounded-full object-cover border-[4px] border-solid border-white"
            src={tempData.profileImageUrl|| defaultProfileImg}
          />
          {isEditing && (
            <label className="absolute left-8 top-[100px] w-[200px] h-[200px] rounded-full flex items-center justify-center bg-black bg-opacity-50 cursor-pointer transition-opacity hover:bg-opacity-70">
              <Camera className="h-8 w-8 text-white" />
              <span className="sr-only">Upload profile picture</span>
              <input
                name="profileImageFile"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profileImageUrl")}
              />
            </label>
          )}
        </div>

        <div className="w-full px-8 max-w-6xl mt-[120px]">
          {isEditing ? (
            // When editing, wrap the fields in a Remix Form so that submitting calls the action.
            <>
              <div className="flex justify-between items-center">
                <div>
                  {/* Name (editable) */}
                  <div className="mb-4">
                    <Input
                      name="name"
                      placeholder="Añade tu nombre"
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
                        placeholder="Añade tu ubicación"
                      />
                    </div>
                  </div>
                </div>

                {/* Form action buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" type="button" onClick={handleEditToggle}>
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="icon" type="submit" disabled={ false /*transition.state === "submitting"*/}>
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
                  placeholder="Cuéntanos algo sobre ti…"
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
                    placeholder="Añade tu teléfono"
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
                    placeholder="Añade tu correo"
                  />
                </div>

                <div className={cn("flex items-center gap-2 p-3", "border")}>
                  <Instagram className="h-5 w-5 text-gray-500" />
                  <Input
                    name="instagram"
                    value={tempData.instagram}
                    onChange={handleChange}
                    className="flex-1"
                    placeholder="Añade tu instagram"
                  />
                </div>
              </div>

              {/* Include non-editable values as hidden inputs */}
              <input type="hidden" name="profileImage" value={tempData.profileImageUrl} />
              <input type="hidden" name="coverImage" value={tempData.coverImageUrl} />
            </>
          ) : (
            // Read-only view.
            <div>
              <div className="flex justify-between items-center">
                <div>
                  {/* Name */}
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold">{tempData.name||"Añade tu nombre"}</h1>
                  </div>
                  {/* Location */}
                  <div className="flex items-center gap-2 mb-6 text-gray-600">
                    <Flag className="h-4 w-4" />
                    <span>
                      {tempData.location||"Añade tu ubicación"}
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
                  <p>{tempData.aboutMe||"Cuéntanos algo sobre ti…"}</p>
                </div>
              </div>

              <Separator className="my-14" />

              {/* Contact information */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-x-2 gap-4">
                <div className={cn("flex items-center gap-2 p-3")}>
                  <Phone className="h-5 w-5 text-gray-500" />
                  <span>{tempData.phoneNumber||"Añade tu teléfono"}</span>
                </div>
                <div className={cn("flex items-center gap-2 p-3")}>
                  <Mail className="h-5 w-5 text-gray-500" />
                  <span>{tempData.email||"Añade tu email"}</span>
                </div>
                <div className={cn("flex items-center gap-2 p-3")}>
                  <Instagram className="h-5 w-5 text-gray-500" />
                  <span>{tempData.instagram||"Añade tu instagram"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Form>
    </div>
  );
}