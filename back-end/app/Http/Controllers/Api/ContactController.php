<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactType;
use App\Services\GoogleMapsService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    protected $mapsService;

    public function __construct(GoogleMapsService $mapsService)
    {
        $this->mapsService = $mapsService;
    }

    /**
     * Display a listing of the resource with filters and pagination.
     */
    public function index(Request $request)
    {
        $query = Contact::query()->with('contactType');

        $query->where('user_id', $request->user()->id);
        
        if ($request->filled('search')) {
            $query->where('name', 'like', "%{$request->search}%")
            ->orWhere('email', 'like', "%{$request->search}%")
            ->orWhere('cpf', 'like', "%{$request->search}%")
            ->orWhere('phone', 'like', "%{$request->search}%")
            ->orWhere('address', 'like', "%{$request->search}%")
            ->orWhere('city', 'like', "%{$request->search}%")
            ->orWhere('state', 'like', "%{$request->search}%")
            ->orWhereHas('contactType', function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%");
            });
        }

        $contacts = $query->paginate(10);

        return response()->json($contacts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'contact_type_id' => 'required|exists:contact_types,id',
            'name' => 'required|string|max:255',
            'photo_path' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'cpf' => ['required', 'string', 'max:14', function($attribute, $value, $fail) {
                $numbers = preg_replace('/\D/', '', $value);
                if (strlen($numbers) !== 11 || !$this->validateCpf($numbers)) {
                    $fail('CPF inválido.');
                }
            }],
            'zip_code' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'number' => 'required|string|max:10',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar latitude e longitude
        $coordinates = $this->mapsService->getCoordinates(
            "{$data['address']}, {$data['number']}, {$data['neighborhood']}, {$data['city']}, {$data['state']}, {$data['zip_code']}"
        );

        \Log::debug("xxx", [$coordinates]);

        $data['latitude'] = $coordinates['lat'] ?? null;
        $data['longitude'] = $coordinates['lng'] ?? null;
        $data['user_id'] = $request->user()->id;

        $data['cpf'] = preg_replace('/\D/', '', $data['cpf']); // armazenar somente números

        $contact = Contact::create($data);

        return response()->json($contact, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        return response()->json($contact->load('contactType'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact)
    {
        $data = $request->all();

        $validator = Validator::make($data, [
            'contact_type_id' => 'required|exists:contact_types,id',
            'name' => 'required|string|max:255',
            'photo_path' => 'nullable|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'cpf' => ['required', 'string', 'max:14', function($attribute, $value, $fail) {
                $numbers = preg_replace('/\D/', '', $value);
                if (strlen($numbers) !== 11 || !$this->validateCpf($numbers)) {
                    $fail('CPF inválido.');
                }
            }],
            'zip_code' => 'required|string|max:10',
            'address' => 'required|string|max:255',
            'number' => 'required|string|max:10',
            'complement' => 'nullable|string|max:255',
            'neighborhood' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Buscar latitude e longitude
        $coordinates = $this->mapsService->getCoordinates(
            "{$data['address']}, {$data['number']}, {$data['neighborhood']}, {$data['city']}, {$data['state']}, {$data['zip_code']}"
        );

        $data['latitude'] = $coordinates['lat'] ?? null;
        $data['longitude'] = $coordinates['lng'] ?? null;

        $data['cpf'] = preg_replace('/\D/', '', $data['cpf']); // armazenar somente números

        $contact->update($data);

        return response()->json($contact);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact)
    {
        $contact->delete();
        return response()->json(['message' => 'Contato deletado com sucesso.']);
    }

    /**
     * Validação de CPF oficial
     */
    private function validateCpf($cpf)
    {
        if (preg_match('/(\d)\1{10}/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            for ($d = 0, $c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$c] != $d) {
                return false;
            }
        }
        return true;
    }
}
