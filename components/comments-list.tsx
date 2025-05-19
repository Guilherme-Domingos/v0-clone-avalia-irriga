import { Card } from "@/components/ui/card"
import Image from "next/image"

interface CommentsListProps {
  comments: string[]
}

export function CommentsList({ comments }: CommentsListProps) {
  return (
    <div className="space-y-2">
      {comments.map((comment, index) => (
        <Card key={index} className="p-3 bg-gray-200">
          <p className="text-sm">{comment}</p>
          {index === 0 && (
            <div className="mt-2">
              <Image
                src="/placeholder.svg?height=100&width=200"
                alt="Imagem do problema"
                width={200}
                height={100}
                className="rounded-md"
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
