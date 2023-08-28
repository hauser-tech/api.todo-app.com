const ErrorHandler = require("../../utils/ErrorHandler");
const User = require("./user-model");
const catchAsyncErrors = require("../../middleware/catchAsyncErrors");
const sendToken = require("../../utils/jwtToken");

exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userEmail = await User.findOne({ email });

    if (userEmail) {
      return next(new ErrorHandler("User already exists", 400));
    }

    const user = {
      email: email.toLowerCase(),
      password: password,
    };

    await User.create(user);
    return res.status(201).json({
      message: "Account created successfully.",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.userLogin = catchAsyncErrors(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all fields!", 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );

    if (!user) {
      return next(new ErrorHandler("User doesn't exists!", 400));
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct information", 400)
      );
    }
    user.password = undefined;
    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {
    return res.status(201).json(req.user);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

exports.userLogout = catchAsyncErrors(async (req, res, next) => {
  try {
    // res.clearCookie("token");
    return res
      .status(201)
      .cookie("token", undefined)
      .json({ message: "User Logged Out Successfully." });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
