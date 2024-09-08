import { useEffect, useState } from "react";
import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function getUrlParams(url = window.location.href) {
	let urlStr = url.split("?")[1];
	return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
	const roomID = getUrlParams().get("roomID") || randomID(5);
	const { user } = useClerk();
	const [userID, setUserID] = useState<string | null>(null); // State to store userID

	// Use effect to wait until the user is available
	useEffect(() => {
		if (user) {
			setUserID(user?.id);
		}
	}, [user]);

	// If user data is not yet available, return a loading state
	if (!userID) {
		return <div>Loading...</div>;
	}

	let myMeeting = (element: HTMLDivElement) => {
		const initMeeting = async () => {
			try {
				// Fetch token and appID from API
				const res = await fetch(`/api/zegocloud?userID=${userID}`);

				// Check if the response is okay
				if (!res.ok) {
					throw new Error(`API request failed with status: ${res.status}`);
				}

				// Parse the response JSON
				const data = await res.json();
				if (!data.token || !data.appID) {
					throw new Error("Incomplete response from API");
				}

				const { token, appID } = data;
				console.log(appID, token);

				const username = user?.fullName || user?.emailAddresses[0].emailAddress.split("@")[0];

				const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(appID, token, roomID, userID, username);

				const zp = ZegoUIKitPrebuilt.create(kitToken);
				zp.joinRoom({
					container: element,
					sharedLinks: [
						{
							name: "Personal link",
							url:
								window.location.protocol +
								"//" +
								window.location.host +
								window.location.pathname +
								"?roomID=" +
								roomID,
						},
					],
					scenario: {
						mode: ZegoUIKitPrebuilt.GroupCall,
					},
				});
			} catch (error) {
				console.error("Error initializing meeting:", error);
			}
		};
		initMeeting();
	};

	return <div className="myCallContainer" ref={myMeeting} style={{ width: "100vw", height: "100vh" }}></div>;
}
