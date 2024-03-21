import { Migration } from '@mikro-orm/migrations';

export class Migration20240321231317 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `books` (`id` integer not null primary key autoincrement, `author` text not null, `title` text not null, `filepath` text not null, `subjects` text not null, `imagepath` text not null, `db_id` integer not null, `bc` integer not null, `suggestions` json not null);');

    this.addSql('create table `jaccard_nodes` (`id` integer not null primary key autoincrement, `book1_id` integer not null, `book2_id` integer not null, `grade` integer not null, constraint `jaccard_nodes_book1_id_foreign` foreign key(`book1_id`) references `books`(`id`) on update cascade, constraint `jaccard_nodes_book2_id_foreign` foreign key(`book2_id`) references `books`(`id`) on update cascade);');
    this.addSql('create index `jaccard_nodes_book1_id_index` on `jaccard_nodes` (`book1_id`);');
    this.addSql('create index `jaccard_nodes_book2_id_index` on `jaccard_nodes` (`book2_id`);');

    this.addSql('create table `words` (`id` integer not null primary key autoincrement, `word` text not null);');

    this.addSql('create table `book_words` (`id` integer not null primary key autoincrement, `book_id` integer not null, `word` text not null, `words_id` integer not null, `occurrence` integer not null, constraint `book_words_book_id_foreign` foreign key(`book_id`) references `books`(`id`) on update cascade, constraint `book_words_words_id_foreign` foreign key(`words_id`) references `words`(`id`) on update cascade);');
    this.addSql('create index `book_words_book_id_index` on `book_words` (`book_id`);');
    this.addSql('create index `book_words_words_id_index` on `book_words` (`words_id`);');
  }

}
