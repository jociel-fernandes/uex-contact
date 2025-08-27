<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{

    protected $fillable = [
        "contact_type_id",
        "name",
        "photo_path",
        "phone",
        "email",
        "cpf",
        "zip_code",
        "address",
        "number",
        "complement",
        "neighborhood",
        "city",
        "state",
        "latitude",
        "longitude",
        "user_id",
    ];

    public function contactType()
    {
        return $this->belongsTo(ContactType::class);
    }

}
