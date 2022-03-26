<?php

namespace App\Controller;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Comment;
use App\Repository\UserRepository;
use App\Repository\CommentRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;


class FakerController extends AbstractController
{
    #[Route('/faker/{user}{comment}', name: 'app_faker')]
    public function index(User $user = null, UserRepository $userRepository, Comment $comment = null, CommentRepository $commentRepo,  UserPasswordHasherInterface $passwordHasher): Response
    {
        $faker = Factory::class::create();

        for ($k=0; $k < 5; $k++) { 
            $user = new User();
            $user
                ->setFirstname($faker->firstName())
                ->setLastname($faker->lastName())
                ->setUsername($user->getFirstname().'.'.$user->getLastname())
                ->setEmail($faker->email);
                $plaintextPassword = $user->getUsername();

                // hash the password (based on the security.yaml config for the $user class)
                $hashedPassword = $passwordHasher->hashPassword(
                    $user,
                    $plaintextPassword
                );
                $user->setPassword($hashedPassword);

                // $userRepository->add($user);

                ///////comments/////////
                $number = rand(1, 10);
                for ($i=0; $i < $number; $i++) { 
                   $comment = new Comment();

                   $comment
                        ->setTitle($faker->sentence(rand(3, 10)))
                        ->setDescription($faker->text(rand(50, 200)))
                        ->setAuthor($user)
                        ->setCreatedAt(new \DateTimeImmutable($faker->date()));
                    // $commentRepo->add($comment);
                }
        }

        return $this->render('faker/index.html.twig', [
            
        ]);
    }
}
