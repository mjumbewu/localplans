import requests
from django.http import HttpResponse

def proxy_view(request, url):
    response = requests.request(
        request.method, url,
        params=request.GET,
        data=request.body)

    return HttpResponse(
        response.content,
        status=response.status_code,
        content_type=response.headers['content-type'])
