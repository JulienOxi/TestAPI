<?php

namespace App\Api\Controller;

use App\Entity\Comment;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class CreateCommentController extends AbstractController{

    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }


    public function __invoke(Comment $data)
    {
        $data->setAuthor($this->security->getUser());
        return $data;
    }
}