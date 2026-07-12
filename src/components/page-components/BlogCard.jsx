export function BlogCard(props) {
  const { image, category, title, description, author, date } = props;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[212px] sm:h-[360px]">
        <img
          className="h-full w-full rounded-md object-cover"
          src={image}
          alt={title}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex">
          <span className="mb-2 rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-600">
            {category}
          </span>
        </div>
        <h2 className="mb-2 line-clamp-2 text-start text-xl font-bold hover:underline">
          {title}
        </h2>
        <p className="text-muted-foreground mb-4 grow line-clamp-3 text-sm">
          {description}
        </p>
        <div className="flex items-center text-sm">
          <img
            className="mr-2 h-8 w-8 rounded-full"
            src="/image/author-pic.jpg"
            alt={author}
          />
          <span>{author}</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
