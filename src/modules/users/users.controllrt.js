import { User } from "../../../database/models/user.model.js";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utils/appError.js";

const getUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.user.userId)
  if (!user) return next(new AppError("There Is no user", 404));
  res.status(201).json({ msg: "Success", user });
});

const updatUser = catchError(async (req, res, next) => {
  let user = await User.findById(req.user.userId);
  // let updatedUser = await User.findByIdAndUpdate(
  //   req.user.userId,
  //   {
  //     firstName: req.body.firstName || updatedUser.firstName,
  //     lastName: req.body.lastName,
  //     city: req.body.city,
  //     address: req.body.address,
  //   },
  //   {
  //     new: true,
  //   }
  // );
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
  user.city = req.body.city || user.city;
  user.address = req.body.address || user.address;

  if (!user) return next(new AppError("There Is no User", 404));
  await user.save();
  res.status(201).json({ msg: "User Updated", user });
});

const deleteUser = catchError(async (req, res, next) => {
  let deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) return next(new AppError("There Is no User", 404));
  res.status(201).json({ msg: "user Deleted" });
});
export { getUser, updatUser, deleteUser };
