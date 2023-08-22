/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('users', table => {
        table.increments("id");
        table.string("first_name").notNullable();
        table.string("last_name").notNullable();
        table.string("password").notNullable();
        table.string("email").unique();
        table.string("contact_no").notNullable();
        table.string("user_type");
        table.timestamps(true,true);
    })
    .then(()=>{
        return knex.schema.createTable("courses", table =>{
            table.increments("id");
            table.string("course_name").notNullable();
            table.decimal("price",8,2).notNullable();
            table.string("duration");
            table.date("start_date");
            table.date("end_date");
            table.string("course_description",200)
            table.timestamps(true,true);
        })
    }).then(()=>{             //linking users and courses table using foreign key//
        return knex.schema.createTable("users_course",table =>{
            table.increments("id");
            table.integer("users_id");
            table.foreign("users_id").references("users.id");
            table.integer("course_id");
            table.foreign("course_id").references("courses.id");
         
        })  
           
    
    })
};  

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("users")
    .then(()=>{
        return knex.schema.dropTable("courses")
    })
    .then(()=>{
        return knex.schema.dropTable("users_course")
    })
};
