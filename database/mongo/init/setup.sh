#!/bin/bash
# Shebang is a special syntax that tells the os which interpreter to use when executing the script i.e., bash

# Command instructs shell to immediately exit script if any errors occur
set -e

# End of MONGO (EOMONGO) - A delimiter used in a here document
# <<- Allow for indentation in a here document

mongosh --username "$MONGO_INITDB_ROOT_USERNAME" --password "$MONGO_INITDB_ROOT_PASSWORD" <<-EOMONGO
    use $MONGO_INITDB_DATABASE;
    db.createUser(
        {
            user: '$MONGO_ACCESS_USERNAME',
            pwd: '$MONGO_ACCESS_PASSWORD',
            roles: [
                {
                    role: 'readWrite',
                    db: '$MONGO_INITDB_DATABASE'
                }
            ]
        }
    );
EOMONGO