<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Services\ViaCepService;
use App\Http\Controllers\Controller;

class AddressController extends Controller
{
    public function getAddressByZipCode($zip_code, ViaCepService $viaCepService)
    {
        if (!$zip_code || !is_string($zip_code) || strlen($zip_code) > 9) {
            return response()->json([
                'message' => 'CEP inválido',
                'errors' => ['zip_code' => ['O campo zip_code é inválido']]
            ], 422);
        }

        $address = $viaCepService->fetchAddress($zip_code);

        if ($address) {
            return response()->json($address);
        }

        return response()->json(['error' => 'CEP não encontrado'], 404);
    }
}
