<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function show(Request $request) : JsonResponse
    {
        return response()->json([
            'name' => $request->user()->name,
            'email' => $request->user()->email
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'nullable|string|min:8|confirmed'
        ]);

        $user = $request->user();
        $user->name = $request->name;

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return response()->json(['message' => 'Perfil atualizado com sucesso']);
    }

    public function destroy(Request $request)
    {
        $request->validate([
            'password' => 'required|string'
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Senha incorreta']
            ]);
        }

        $user->delete();

        return response()->json(['message' => 'Conta removida com sucesso']);
    }
}