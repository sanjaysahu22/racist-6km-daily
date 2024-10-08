-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "Category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_blogcategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_usercategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_blogcategory_AB_unique" ON "_blogcategory"("A", "B");

-- CreateIndex
CREATE INDEX "_blogcategory_B_index" ON "_blogcategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_usercategory_AB_unique" ON "_usercategory"("A", "B");

-- CreateIndex
CREATE INDEX "_usercategory_B_index" ON "_usercategory"("B");

-- AddForeignKey
ALTER TABLE "_blogcategory" ADD CONSTRAINT "_blogcategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_blogcategory" ADD CONSTRAINT "_blogcategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usercategory" ADD CONSTRAINT "_usercategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_usercategory" ADD CONSTRAINT "_usercategory_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
