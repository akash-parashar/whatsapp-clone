import { generateToken04 } from "./zegoServerAssistant";

export async function GET(req: Request) {
	const url = new URL(req.url);
	const userID = url.searchParams.get("userID");

	// Ensure userID is provided
	if (!userID) {
		return new Response(
			JSON.stringify({ error: "Missing userID" }),
			{ status: 400 }
		);
	}

	// Ensure ZEGO_APP_ID and ZEGO_SERVER_SECRET are available
	const appID = +process.env.NEXT_PUBLIC_ZEGO_APP_ID!!;
	const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
	if (!appID || !serverSecret) {
		console.error("Missing ZEGO_APP_ID or ZEGO_SERVER_SECRET in environment variables");
		return new Response(
			JSON.stringify({ error: "Missing ZEGO_APP_ID or ZEGO_SERVER_SECRET" }),
			{ status: 500 }
		);
	}

	try {
		const effectiveTimeInSeconds = 3600;
		const payload = "";

		// Generate the token
		const token = generateToken04(appID, userID, serverSecret, effectiveTimeInSeconds, payload);

		// Return the generated token and appID
		return new Response(
			JSON.stringify({ token, appID }),
			{ status: 200, headers: { "Content-Type": "application/json" } }
		);
	} catch (error) {
		console.error("Error generating token:", error);
		return new Response(
			JSON.stringify({ error: "Failed to generate token" }),
			{ status: 500 }
		);
	}
}
