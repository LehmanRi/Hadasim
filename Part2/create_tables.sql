CREATE TABLE Person (
    Person_Id     INTEGER PRIMARY KEY,
    Personal_Name TEXT,
    Family_Name   TEXT,
    Gender        TEXT CHECK (Gender IN ('M', 'F')),
    Father_Id     INTEGER,
    Mother_Id     INTEGER,
    Spouse_Id     INTEGER,
    FOREIGN KEY(Father_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY(Mother_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY(Spouse_Id) REFERENCES Person(Person_Id)
);

CREATE TABLE Person_Relationship (
    Person_Id        INTEGER,
    Relative_Id      INTEGER,
    Connection_Type  TEXT CHECK (
        Connection_Type IN (
            'father',
            'mother',
            'brother',
            'sister',
            'son',
            'daughter',
            'partner'
        )
    ),
    PRIMARY KEY (Person_Id, Relative_Id, Connection_Type),
    FOREIGN KEY(Person_Id) REFERENCES Person(Person_Id),
    FOREIGN KEY(Relative_Id) REFERENCES Person(Person_Id)
);
