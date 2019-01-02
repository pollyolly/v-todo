const Sqlite = require("nativescript-sqlite")
const table = "tblVuetodo"
const database = "vuetodo.db"
const dbversion = 0
const sqlite = {
    copyDb: function () {
        // if (Sqlite.exists(database)) {
        //     Sqlite.deleteDatabase(database);
        //     console.log("Successfully deleted database");
        // }
        if (!Sqlite.exists(database)) {
            Sqlite.copyDatabase(database);
            console.log("Successfully copied database");
        }
    },
    init: function () {
        new Sqlite(database, function (err, db) {
            console.log("Is a Sqlite Database: ", Sqlite.isSqlite(db) ? "Yes" : "No");
            db.version(function(err, ver) {
                if (ver === dbversion) {
                    db.execSQL("CREATE TABLE IF NOT EXISTS "+table+" (" +
                        "`id` INTEGER PRIMARY KEY AUTOINCREMENT," +
                        "`title` TEXT," +
                        "`datetime` DATETIME," +
                        "`desc` TEXT," +
                        "`status` TEXT);");
                    if(err){
                        console.log('Database error: ' + err);
                    } else { console.log('Table successfully created'); }
                    db.version(1)
                }
            })
        })
    },
    alterTable: function(){
        // new Sqlite(database, function (err, db) {
        //     db.version(function(err, ver) {
        //         if (ver === dbversion) {
        //             db.execSQL("ALTER TABLE "+table+" "+
        //                 "ADD " +
        //                 "`time` DATETIME;");
        //             if(err){
        //                 console.log('Database error: ' + err);
        //             } else { console.log('Table successfully updated'); }
        //         }
        //     })
        // })
    },
    todo: function (data) {
        let response = null
        new Sqlite(database, function (err, db) {
            db.execSQL("INSERT INTO `"+table+"` (`title`, `datetime`, `desc`, `status`) VALUES (?,?,?,?);", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
                response = id
            })
        })
        return response
    },
    update: function (data) {
        let response = null
        new Sqlite(database, function (err, db) {
            db.execSQL("UPDATE "+table+" SET `title`= ?,`datetime`= ?,`desc`= ? WHERE `id`= ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                } 
                response = id
            });
        })
        return response
    },
    done: function (data) {
        let response = null
        new Sqlite(database, function (err, db) {
            db.execSQL("UPDATE "+table+" SET `status` = ? WHERE `id` = ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                } 
                response = id
            });
        })
        return response
    },
    sched: function (data) {
        let response = null
        new Sqlite(database, function (err, db) {
            db.execSQL("UPDATE "+table+" SET `status` = ? WHERE `id` = ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                } 
                response = id
            });
        })
        return response
    },
    delete: function (data) {
        let response = null
        new Sqlite(database, function (err, db) {
            db.execSQL("DELETE FROM "+table+" WHERE `id` = ?", data, function (err, id) {
                if (err) {
                    response = false
                    console.log(err);
                }
                response = id
            });
        })
        return response
    },
    listTodo: function () {
        let response = []
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `status` IN ('todo','alert')", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err);
                }
                if(rows.length > 0) {
                    for(var row in rows){
                        response.push({
                            'id':rows[row][0],
                            'title':rows[row][1],
                            'datetime':rows[row][2],
                            'desc':rows[row][3],
                            'status':rows[row][4]
                        })
                    }
                }
            });
        })
        return response
    },
    listDone: function () {
        let response = []
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `status` = 'done'", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err)
                }
                if(rows.length > 0) {
                    for(var row in rows){
                        response.push({
                            'id':rows[row][0],
                            'title':rows[row][1],
                            'datetime':rows[row][2],
                            'desc':rows[row][3],
                            'status':rows[row][4]
                        })
                    }
                }
            });
        })
        return response
    },
    findRecord: function(id){
        let response = []
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `id` = ?", id, function (err, rows) {
                if (err) {
                    response = false
                    console.log(err)
                }
                if(rows.length > 0) {
                    for(var row in rows){
                        response.push({
                            'id':rows[row][0],
                            'title':rows[row][1],
                            'datetime':rows[row][2],
                            'desc':rows[row][3],
                            'status':rows[row][4]
                        })
                    }
                }
            });
        })
        return response
    },
    totalTodo: function(){
        let response = 0
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `status` IN ('todo','alert')", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err)
                }
                if(rows.length > 0) {
                    response = rows.length
                }
            });
        })
        return response
    },
    totalMiss: function(date){
        let response = 0
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `status` = 'todo' AND `datetime` < ?", date, function (err, rows) {
                if (err) {
                    response = false
                    console.log(err)
                }
                if(rows.length > 0) {
                    response = rows.length
                }
            });
        })
        return response
    },
    totalDone: function(){
        let response = 0
        new Sqlite(database, function (err, db) {
            db.all("SELECT * FROM "+table+" WHERE `status` = 'done'", [], function (err, rows) {
                if (err) {
                    response = false
                    console.log(err)
                }
                if(rows.length > 0) {
                    response = rows.length
                }
            });
        })
        return response
    }
}
export default sqlite