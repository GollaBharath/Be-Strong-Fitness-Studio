import { NextResponse } from "next/server";
import { getSessionContext } from "../../../../lib/auth/server";

export async function GET() {
	const session = await getSessionContext();
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({ user: session });
}
