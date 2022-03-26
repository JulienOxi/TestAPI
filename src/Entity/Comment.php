<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use App\Repository\CommentRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use App\Api\Controller\CreateCommentController;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

#[ApiResource (
    normalizationContext:['groups' => ['read:comment']],
    collectionOperations:[
        "GET", 
        "post"=>[
            "controller"=>CreateCommentController::class
        ]
    ],
    itemOperations:[
        "GET"=>[
        "normalization_context"=>['groups' => ['read:comment', 'read:full:comment']]
        ],
        "delete"
    ],
    attributes: ["pagination_items_per_page" => 10]
)]
#[ApiFilter(SearchFilter::class, properties: ["author" => "exact"])]

#[ORM\Entity(repositoryClass: CommentRepository::class)]
class Comment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    #[Groups(["read:comment"])]
    private $id;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["read:comment"])]
    private $title;

    #[ORM\Column(type: 'string', length: 255)]
    #[Groups(["read:full:comment"])]
    private $description;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'comments')]
    #[Groups(["read:comment"])]
    private $author;

    #[ORM\Column(type: 'datetime_immutable')]
    #[Groups(["read:comment"])]
    private $createdAt;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): self
    {
        $this->author = $author;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
