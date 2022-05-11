import db from "../models/index";
import CRUDService from "../service/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render("home_page.ejs", {
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    // return res.send(message);
    return res.redirect("/get-crud");
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log("---------------------------------");
    console.log(data);
    console.log("---------------------------------");
    return res.render("displayCRUD.ejs", {
        dataTable: data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render("editCRUD.ejs", {
            user: userData,
        });
    } else {
        return res.send("User not found!");
    }
};

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDService.updateUserData(data);
    // return res.send("Update done!");
    return res.redirect("/get-crud");
};

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        await CRUDService.deleteUserById(userId);
        // return res.send("Delete user success!");
        return res.redirect("/get-crud");
    } else {
        return res.send("User not found!");
    }
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putCRUD,
    deleteCRUD,
};
