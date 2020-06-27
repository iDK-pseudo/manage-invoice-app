### TODO: A utility class which will be created by the user , with Class name as " _[your roll number]" ,
# TODO: all transformations should be written inside a function which will be called inside the predict method
from datetime import datetime

class _1706592():

    ## TODO: Please note that document id should be present till the getPredictions method

    def __tranformation1(self,data):
        def remove_days(x):
            new_day = str(x).strip()[:-14:]
            if(new_day.isnumeric()):
                return int(new_day)
            return 0

        grouped = data.groupby('business_code')['actual_open_amount'].mean().to_dict()
        data['business_code_numerical'] = data['business_code'].map(grouped)
        [m,n] = data.shape
        total_time_invoice = list()
        for i in range(m):
            d = datetime.strptime(data.loc[i,'clearing_date'], "%b %d, %Y") - datetime.strptime(data.loc[i,'document_create_date'], "%b %d, %Y")
            total_time_invoice.append(remove_days(d))

        data['total_time_invoice'] = total_time_invoice

        return data

    def __transformation2(self,data):

        # your transformation logic goes here
        return data

    def getPredictions(self,data,model):
        data = self.__tranformation1(data)
        data = self.__transformation2(data)
        # your feature list, column names
        features = ['customer_number','cust_payment_terms','invoice_amount_doc_currency','dayspast_due','total_time_invoice','business_code_numerical']
        print(data[features])
        
        # data should be a dataFrame and not a numpy array
        predictions = model.predict(data[features])
        data['predictions'] = predictions
        pred = data.loc[:,['document_id','predictions']].to_dict(orient="records")
        return pred
