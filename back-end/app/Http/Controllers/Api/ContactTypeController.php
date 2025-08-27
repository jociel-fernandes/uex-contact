<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactTypeController extends Controller
{
    public function index()
    {
        return response()->json(ContactType::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:contact_types,name|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = ContactType::create($request->only('name'));

        return response()->json($type, 201);
    }

    public function show(ContactType $contactType)
    {
        return response()->json($contactType);
    }

    public function update(Request $request, ContactType $contactType)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:contact_types,name,' . $contactType->id . '|max:255'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $contactType->update($request->only('name'));

        return response()->json($contactType);
    }

    public function destroy(ContactType $contactType)
    {
        $contactType->delete();
        return response()->json(['message' => 'Tipo de contato deletado com sucesso.']);
    }
}
