from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Ticket
from .serializers import TicketSerializer
from django.http import HttpResponse

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer
    
    def get_permissions(self):
        if self.action == 'create': # Customers can create
            return [AllowAny()]
        return [IsAuthenticated()] # Staff only for list/update/delete

@api_view(['GET'])
def get_stats(request):
    total = Ticket.objects.count()
    open_t = Ticket.objects.filter(status='open').count()
    return Response({
        "total_tickets": total,
        "open_tickets": open_t,
        "closed_tickets": total - open_t
    })

def health(request):
    return HttpResponse("OK")
