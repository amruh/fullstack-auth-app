"use server";

export async function emailVerification(token: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/send-email-verification`,
      {
        headers: new Headers({ "Content-Type": "application/json" }),
        method: "POST",
        body: JSON.stringify({ token }),
        cache: 'no-store',
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
