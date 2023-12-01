const fs = require("fs").promises;
const path = require("path");
require("colors");
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
  try {
    const allContacts = await fs.readFile(contactsPath);
    const parsed = JSON.parse(allContacts);
    console.table(parsed);
    return parsed;
  } catch (error) {
    console.log(error.message.red);
    throw new Error(error.message);
  }
}

async function getContactById(contactId) {
  try {
    const allContacts = await listContacts();
    const contactById = allContacts.filter(
      (contact) => contactId === contact.id
    );
    console.log(contactById.length === 0 ? null : contactById);
    return contactById.length === 0 ? null : contactById;
  } catch (error) {
    console.log(error.message.red);
    return null;
  }
}

async function removeContact(contactId) {
  try {
    const allContacts = await listContacts();
    const contactToRemove = allContacts.find(
      (contact) => contact.id === contactId
    );

    if (contactToRemove) {
      const filteredContacts = allContacts.filter(
        (contact) => contact.id !== contactId
      );

      await fs.writeFile(
        contactsPath,
        JSON.stringify(filteredContacts, null, 2)
      );
      console.log(contactToRemove);
      console.log("Contact deleted successfully".green);
      return contactToRemove;
    } else {
      console.log(null);
      return null;
    }
  } catch (error) {
    console.log(error.message.red);
    return null;
  }
}

async function addContact(name, email, phone) {
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };
  try {
    const allContacts = await listContacts();
    const newContactsList = [...allContacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(newContactsList, null, 2));

    console.log(newContact);
    console.log("Contact added successfully!".green);

    return newContact;
  } catch (error) {
    console.log(error.message.red);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
