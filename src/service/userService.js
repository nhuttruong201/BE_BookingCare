import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // * user already exist
                // * recheck email
                let user = await db.User.findOne({
                    where: { email: email },
                    raw: true,
                    attributes: ["email", "roleId", "password"],
                });
                if (user) {
                    // * compare password
                    let checkPassword = bcrypt.compareSync(
                        password,
                        user.password
                    );

                    if (checkPassword) {
                        // * success
                        userData.errCode = 0;
                        userData.errMessage = "Ok";

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password!";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Your's email isn't exist in your system. Plz try other email!`;
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in your system. Plz try other email!`;
            }

            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (inputEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: inputEmail },
            });

            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    // raw: true
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                });
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // * check email is exist ???
            let checkEmail = await checkUserEmail(data.email);
            if (checkEmail) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Email is already in used. Plz try another email!",
                });
            }
            let hashPasswordFromBrcypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBrcypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === 1 ? true : false,
                roleId: data.roleId,
            });
            resolve({
                errCode: 0,
                errMessage: "Ok",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "The user not exist!",
                });
            }

            // await user.destroy();
            await db.User.destroy({
                where: { id: userId },
            });

            resolve({
                errCode: 0,
                errMessage: "The user is deleted!",
            });
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters!",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                // await db.User.save({
                //     where: { id: data.id },
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // });

                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: "Update the user succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found!",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
};
