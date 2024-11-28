from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Project
from .serializers import ProjectSerializer

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def project_list(request):
    if request.method == 'GET':
        projects = Project.objects.filter(owner=request.user)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def project_detail(request, pk):
    try:
        project = Project.objects.get(pk=pk, owner=request.user)  
    except Project.DoesNotExist:
        return Response(
            {'detail': 'Project not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ProjectSerializer(project, data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        project.delete()
        return Response(
            {'detail': 'Project successfully deleted'},
            status=status.HTTP_204_NO_CONTENT
        )

# Share Functionality
@api_view(["POST"])
def share_project(request, pk):
    try:
        project = Project.objects.get(pk=pk)
        project_serializer = ProjectSerializer(project)

        # Create a discussion with shared project details
        shared_data = {
            "title": f"Shared Project: {project.name}",
            "description": project.description,
            "additional_info": project_serializer.data,
        }

        discussion_serializer = DiscussionSerializer(data=shared_data)
        if discussion_serializer.is_valid():
            discussion = discussion_serializer.save()
            return Response(
                {
                    "message": "Project shared successfully!",
                    "shared_project": discussion.id,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(
                discussion_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )
    except Project.DoesNotExist:
        return Response(
            {"error": "Project not found."}, status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["GET", "POST"])
def discussion_list(request):
    if request.method == "GET":
        discussions = Discussion.objects.all()
        serializer = DiscussionSerializer(discussions, many=True)
        return Response(serializer.data)
    elif request.method == "POST":
        serializer = DiscussionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def discussion_detail(request, pk):
    try:
        discussion = Discussion.objects.get(pk=pk)
    except Discussion.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = DiscussionSerializer(discussion)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = DiscussionSerializer(discussion, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        discussion.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
