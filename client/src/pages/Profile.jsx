import { useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
} from "../services/userService";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        if (!cancelled) {
          setProfile(data);

          setFormData({
            name: data.name || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (formError) {
      setFormError("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
  };

  const handleEdit = () => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
    });

    setFormError("");
    setSuccessMessage("");
    setEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
    });

    setFormError("");
    setSuccessMessage("");
    setEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    setFormError("");
    setSuccessMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (name.length < 2) {
      setFormError("Name must be at least 2 characters long.");
      return;
    }

    if (name.length > 50) {
      setFormError("Name cannot exceed 50 characters.");
      return;
    }

    if (!email || !email.includes("@")) {
      setFormError("Please provide a valid email.");
      return;
    }

    const updates = {
      name,
      email,
    };

    setSaving(true);

    try {
      const updatedProfile = await updateProfile(updates);

      setProfile(updatedProfile);

      setFormData({
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
      });

      setEditing(false);
      setSuccessMessage("Profile updated successfully.");
    } catch (err) {
      setFormError(
        err.message || "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-text-secondary">
            Loading your profile...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          role="alert"
          className="rounded-xl border border-border bg-surface p-8 text-center"
        >
          <h1 className="font-serif text-2xl font-bold text-primary">
            Unable to load profile
          </h1>

          <p className="mt-3 text-sm text-text-secondary">
            {error}
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Account
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold text-primary sm:text-5xl">
          My Profile
        </h1>

        <p className="mt-3 text-text-secondary">
          View and manage your account information.
        </p>
      </div>

      {successMessage && (
        <div
          role="status"
          className="mt-6 rounded-lg border border-border bg-soft px-4 py-3 text-sm font-medium text-primary"
        >
          {successMessage}
        </div>
      )}

      <section className="mt-10 rounded-xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-soft">
              <span className="font-serif text-3xl font-bold text-primary">
                {profile.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>

            <div>
              <h2 className="font-serif text-2xl font-bold text-primary">
                {profile.name}
              </h2>

              <p className="mt-1 text-sm text-text-secondary">
                {profile.email}
              </p>

              <span className="mt-3 inline-block rounded-full bg-soft px-3 py-1 text-xs font-semibold capitalize text-primary">
                {profile.role}
              </span>
            </div>
          </div>

          {!editing && (
            <button
              type="button"
              onClick={handleEdit}
              className="w-fit rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="mt-8 border-t border-border pt-8">
          {editing ? (
            <form onSubmit={handleSubmit}>
              <h3 className="font-serif text-xl font-bold text-primary">
                Edit Account Information
              </h3>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="text-sm font-semibold text-text"
                  >
                    Full Name
                  </label>

                  <input
                    id="profile-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={50}
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="profile-email"
                    className="text-sm font-semibold text-text"
                  >
                    Email Address
                  </label>

                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {formError}
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-semibold text-text transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h3 className="font-serif text-xl font-bold text-primary">
                Account Information
              </h3>

              <dl className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Full Name
                  </dt>

                  <dd className="mt-2 text-sm font-medium text-text">
                    {profile.name}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Email Address
                  </dt>

                  <dd className="mt-2 break-all text-sm font-medium text-text">
                    {profile.email}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Account Type
                  </dt>

                  <dd className="mt-2 text-sm font-medium capitalize text-text">
                    {profile.role}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;