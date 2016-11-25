/**
 * This is a middleware checker to see if user is admin.
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {void}
 */
export default function adminCheck(req, res, next) {
  if (req.decoded.RoleId === 1) {
    next();
  } else {
    res.status(403).send({ message: 'Access denied.' });
  }
}
