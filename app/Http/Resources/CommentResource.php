<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "text" => $this->text,
            "score" => $this->score,
            "user_name" => $this->user->name,
            "book_id" => $this->book->id,
            "created_at" => $this->created_at,
        ];
    }
}
