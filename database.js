import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('AlphabetDB.db');

// Function to initialize the database
const initializeDatabase = () => {
    return new Promise((resolve, reject) => {

        db.transaction(tx => {

            tx.executeSql(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='alphabet'",
                [],
                (_, resultSet) => {
                    if (resultSet.rows.length === 0) { // if table does not exist
                        const chars = createData();
                        tx.executeSql('CREATE TABLE IF NOT EXISTS alphabet (name TEXT, selected INTEGER)', [], () => {
                            insertRows(chars) // insert rows after table creation
                                .then(() => {
                                    resolve({success: true, message: "Database initialized."});
                                })
                                .catch((error) => {
                                    reject({message: 'Error occurred while inserting rows', error: error});
                                    return false;
                                });
                        }, (error) => {
                            reject({message: 'Error occurred while initializing database', error: error});
                            return false;
                        });
                    } else { // if table already exists
                        tx.executeSql('SELECT COUNT(*) AS count FROM alphabet', [], (_, {rows: {_array}}) => {
                            if (_array[0].count === 0) { // if table is empty
                                const chars = createData();
                                insertRows(chars) // insert rows
                                    .then(() => {
                                        resolve({success: true, message: "Data inserted into existing table."});
                                    })
                                    .catch((error) => {
                                        reject({message: 'Error occurred while inserting rows', error: error});
                                        return false;
                                    });
                            } else {
                                resolve({success: true, message: "Table already exists and contains data."});
                            }
                        }, (error) => {
                            reject({message: 'Error occurred while checking data existence', error: error});
                            return false;
                        });
                    }
                },
                (error) => {
                    reject({message: 'Error occurred while checking table existence', error: error});
                    return false;
                }
            );
        });
    });
};

// Function to insert a row
const insertRow = (name, selected) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('INSERT INTO alphabet (name, selected) VALUES (?, ?)', [name, selected ? 1 : 0],
                () => {
                    resolve();
                },
                (error) => {
                    reject();
                }
            );
        });
    });
};

const insertRows = (chars) => {
    const insertPromises = chars.map(({name, selected}) => {
        return insertRow(name, selected);
    });

    return Promise.all(insertPromises);
};

// Function to retrieve all rows
const getAllRows = (callback) => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM alphabet', [], (_, {rows}) => callback(rows._array), (error) => console.log('Error occurred while retrieving rows:', error));
    });
};

// Function to retrieve all selected rows
const getAllSelectedRows = (callback) => {
    db.transaction((tx) => {
        tx.executeSql('SELECT * FROM alphabet WHERE selected = 1', [], (_, {rows}) => callback(rows._array), (error) => console.log('Error occurred while retrieving selected rows:', error));
    });
};

// Function to select an item
const selectItem = (name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE alphabet SET selected = 1 WHERE name = ?', [name],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve();
                    } else {
                        reject();
                    }
                },
                (error) => {
                    console.log('Error occurred while selecting item:', error);
                    reject();
                }
            );
        });
    });
};

// Function to deselect an item
const deselectItem = (name) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql('UPDATE alphabet SET selected = 0 WHERE name = ?', [name],
                (_, { rowsAffected }) => {
                    if (rowsAffected > 0) {
                        resolve();
                    } else {
                        reject();
                    }
                },
                (error) => {
                    console.log('Error occurred while deselecting item:', error);
                    reject();
                }
            );
        });
    });
};

const createData = () => {
    const chars = [];

    // Loop through ASCII values for A-Z (65-90)
    for (let i = 65; i <= 90; i++) {
        chars.push({
            name: String.fromCharCode(i), selected: 0
        });
    }

    // Loop through ASCII values for 0-9 (48-57)
    for (let i = 48; i <= 57; i++) {
        chars.push({
            name: String.fromCharCode(i), selected: 0
        });
    }

    return chars
}


export default {
    initializeDatabase, insertRow, getAllRows, getAllSelectedRows, selectItem, deselectItem
};
