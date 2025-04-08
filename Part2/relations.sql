-- ex1
-- father
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Person_Id,
    Person.Father_Id,
    'father'
FROM Person
WHERE Father_Id IS NOT NULL;
-- son of father
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Father_Id,
     Person.Person_Id,
    'son'
FROM Person
WHERE Father_Id IS NOT NULL and Person.Gender='M';
-- daughter of father
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT

     Person.Person_Id,
     Person.Father_Id,
    'daughter'
FROM Person
WHERE Father_Id IS NOT NULL and Person.Gender='F';
-- mother
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Person_Id,
    Person.Mother_Id,
    'mother'
FROM Person
WHERE Mother_Id IS NOT NULL;
-- son of mother
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Mother_Id,
     Person.Person_Id,
       'son'
FROM Person
WHERE Mother_Id IS NOT NULL  and Person.Gender='M';
-- daughter of mother
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Mother_Id,
     Person.Person_Id,
    'daughter'
FROM Person
WHERE Mother_Id IS NOT NULL and Person.Gender='F';

INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    Person.Person_Id,
    Person.Spouse_Id,
    'partner'
FROM Person
WHERE Spouse_Id IS NOT NULL;

-- sister
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id,
       p2.Person_Id,
       'sister'
FROM Person p1
JOIN Person p2
  ON p1.Person_Id != p2.Person_Id
 AND p2.Gender = 'F'
 AND (
      (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
   OR (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
 );

--brother
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT p1.Person_Id,
       p2.Person_Id,
       'brother'
FROM Person p1
JOIN Person p2
  ON p1.Person_Id != p2.Person_Id
 AND p2.Gender = 'M'
 AND (
      (p1.Father_Id IS NOT NULL AND p1.Father_Id = p2.Father_Id)
   OR (p1.Mother_Id IS NOT NULL AND p1.Mother_Id = p2.Mother_Id)
 );
-- ex2
INSERT INTO Person_Relationship (Person_Id, Relative_Id, Connection_Type)
SELECT
    pr.Relative_Id,
    pr.Person_Id,
    'partner'
FROM Person_Relationship pr
WHERE pr.Connection_Type = 'partner'
  AND NOT EXISTS (
      SELECT 1
      FROM Person_Relationship pr2
      WHERE pr2.Person_Id = pr.Relative_Id
        AND pr2.Relative_Id = pr.Person_Id
        AND pr2.Connection_Type = 'partner'
  );