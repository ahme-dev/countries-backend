export const requireAuth = (req, res, next) => {
	if (!req.session.username)
		return res.status(401).json({ message: "Not logged in." });

	next();
};
