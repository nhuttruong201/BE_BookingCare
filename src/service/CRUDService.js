import bcrypt from "bcryptjs";
import db from "../models/index";
const salt = bcrypt.genSaltSync(10);

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                // image: "",
                // positionId: "",
            });
            resolve("ok create a new user succeeded!");
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

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true, //* return array
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    });
};

let getUserInfoById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userInfo = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });
            if (userInfo) {
                resolve(userInfo);
            } else {
                resolve({});
            }
        } catch (error) {
            reject(error);
        }
    });
};

let updateUserData = (data) => {
    console.log("data from service: ", data);
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                await user.save();
                resolve();
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });
            if (user) {
                user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById,
};
