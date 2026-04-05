export const SESSION_COOKIE_NAME = "__session";
export const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 5;

export const USER_ROLES = {
	USER: "user",
	STAFF: "staff",
};

export const ALLOWED_ROLES = new Set(Object.values(USER_ROLES));
