from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import requests
from requests.exceptions import Timeout
import json



def get_trace(req):
    
    try:
        response = requests.get('http://flaskosa.herokuapp.com/cmd/TRACE', timeout=1)
        response = response.json()
    except Timeout:
        return JsonResponse({"msg": "Request timed out. Trying to fetch again..."}, status=503)
    except Exception:
        return JsonResponse({"msg": "Couldn't fetch the data from device. Trying to fetch again..."}, status=503)
    return JsonResponse(response)

def start_simulation(req):
    response = requests.get('http://flaskosa.herokuapp.com/cmd/START')
    return HttpResponse(response)


def end_simulation(req):
    response = requests.get('http://flaskosa.herokuapp.com/cmd/END')
    return HttpResponse(response)


@csrf_exempt
def query(req):
    query = json.loads(req.body)['query']
    response = requests.get('http://flaskosa.herokuapp.com/cmd/ECHO/%s' % {query})
    res_txt = str(response.text)
    if res_txt.startswith("+READY>"):
        return HttpResponse(str(response.text)[13:])
    else:
        return JsonResponse({"msg": "Cannot query the server. Please try again."}, status=503)

@csrf_exempt
def handle_limit(req):
    if req.method == "GET":
        response = requests.get('http://flaskosa.herokuapp.com/cmd/LIM')
        res_txt = str(response.text)
        if res_txt.startswith("+READY>"):
            return JsonResponse({"limit": res_txt[8:-1].split(", ")})
        else:
            return JsonResponse({"msg": "Couldn't fetch the limit from device. Please try again."}, status=503)
    elif req.method == "POST":
        lower, upper = json.loads(req.body)['limit']
        if lower >= upper or lower <= 1515 or upper >= 1580:
            return JsonResponse({"msg": "Invalid limit. Limit must be in range (1515, 1580) exclusive on both sides."}, status=400)
        response = requests.get(
            'http://flaskosa.herokuapp.com/cmd/LIM/[%d,%d]' % (lower, upper))
        if str(response.text).startswith("+READY>"):
            return HttpResponse(response)
        else:
            return JsonResponse({"msg": "Couldn't fetch the limit from device. Please try again."}, status=503)
        
