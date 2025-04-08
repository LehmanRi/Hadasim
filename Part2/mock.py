import random
from faker import Faker

fake = Faker()
num_people = 100
people = []
male_ids = []
female_ids = []

for person_id in range(1, num_people + 1):
    gender = random.choice(['M', 'F'])
    first_name = fake.first_name_male() if gender == 'M' else fake.first_name_female()
    last_name = fake.last_name()

    person = {
        'Person_Id': person_id,
        'Personal_Name': first_name.replace("'", "''"),
        'Family_Name': last_name.replace("'", "''"),
        'Gender': gender,
        'Father_Id': None,
        'Mother_Id': None,
        'Spouse_Id': None
    }

    if len(male_ids) > 0 and random.random() < 0.8:
        person['Father_Id'] = random.choice(male_ids)

    if len(female_ids) > 0 and random.random() < 0.8:
        person['Mother_Id'] = random.choice(female_ids)

    if gender == 'M':
        male_ids.append(person_id)
    else:
        female_ids.append(person_id)

    people.append(person)

# Assign mutual spouses
unmarried = [p for p in people if p['Spouse_Id'] is None]
random.shuffle(unmarried)

for i in range(0, len(unmarried) - 1, 2):
    p1 = unmarried[i]
    p2 = unmarried[i + 1]
    if p1['Gender'] != p2['Gender'] and random.random() < 0.4:
        p1['Spouse_Id'] = p2['Person_Id']
        p2['Spouse_Id'] = p1['Person_Id']

# Write SQL inserts
with open('people.sql', 'w', encoding='utf-8') as sqlfile:
    sqlfile.write("-- Generated INSERT statements for the Person table\n\n")
    for person in people:
        sql = f"""INSERT INTO Person (Person_Id, Personal_Name, Family_Name, Gender, Father_Id, Mother_Id, Spouse_Id)
VALUES ({person['Person_Id']}, '{person['Personal_Name']}', '{person['Family_Name']}', '{person['Gender']}', \
{person['Father_Id'] if person['Father_Id'] is not None else 'NULL'}, \
{person['Mother_Id'] if person['Mother_Id'] is not None else 'NULL'}, \
{person['Spouse_Id'] if person['Spouse_Id'] is not None else 'NULL'});"""
        sqlfile.write(sql + '\n')

print("✅ Done! SQL file written to 'people.sql'")
