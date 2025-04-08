
import pandas as pd

df = pd.read_excel('time_series.xlsx')
df.drop_duplicates(inplace=True, subset=['timestamp'], keep=False)
df = df[df['value'].apply(lambda x: isinstance(x, (int, float)) and not pd.isna(x))]
df.sort_values(by='timestamp', inplace=True)
columns = ['Start_Time', 'Average']
start_value = df.iloc[0, 0].floor('h')
value=0
count=0
results=[]
for index, row in df.iterrows():
    if row['timestamp'] < start_value+ pd.Timedelta(hours=1):
        value+=row['value']
        count+=1
    else:
        average_value = value/count
        results.append([start_value,average_value])
        start_value= start_value+ pd.Timedelta(hours=1)
        value = row['value']
        count = 1
if count > 0:
    average_value = value / count
    results.append([start_value,average_value])
df_result = pd.DataFrame(results,columns=columns)
df_result.to_excel("output_average_value2.1.xlsx", index=False)