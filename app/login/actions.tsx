"use server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return redirect(`/login?message=${error.message}`);
    }

    return redirect("/protected");
};

export const signUp = async (formData: FormData) => {
    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        return redirect(`/login?message=${error.message}`);
    }

    // OPTIONAL: insert user into DB
    const userId = data.user?.id;
    console.log(data);
    if (userId && email) {
        await fetch(`${origin}/api/users`, {
            method: "POST",
            body: JSON.stringify({ id: userId, email }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    return redirect("/login?message=Check email to continue sign in process");
};

export const signInWithGoogleOAuth = async () => {
    const origin = headers().get("origin");
    const supabase = createClient();

    const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`, // make sure this exists!
        },
    });

    if (error) {
        return redirect(`/login?message=${error.message}`);
    }

    return redirect(data.url);
};
