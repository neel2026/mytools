from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate, update_session_auth_hash
from django.contrib.auth.forms import AuthenticationForm, PasswordChangeForm
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# Create your views here.

@login_required(login_url='main:login')
def home(request):
    return render(request, 'main/home.html')

@login_required(login_url='main:login')
def calculator(request):
    return render(request, 'main/calculator.html')

@login_required(login_url='main:login')
def tictactoe(request):
    return render(request, 'main/tictactoe.html')

@login_required(login_url='main:login')
def flappybird(request):
    return render(request, 'main/flappybird.html')

def login_user(request):
    if request.user.is_authenticated:
        return redirect('main:home')
    
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome back, {username}!")
                return redirect('main:home')
        else:
            messages.error(request, "Invalid username or password.")
    else:
        form = AuthenticationForm()
    
    return render(request, 'main/login.html', {'form': form})

@login_required(login_url='main:login')
def logout_user(request):
    logout(request)
    messages.success(request, "Successfully logged out!")
    return redirect('main:login')

@login_required(login_url='main:login')
def change_password(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, 'Your password was successfully updated!')
            return redirect('main:home')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'main/change_password.html', {'form': form})
