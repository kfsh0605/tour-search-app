import type { Hotel, PriceOffer } from '../../../types';
import { Button } from '../../ui';
import { getCountryFlagUrl } from '../../../utils';
import styles from './TourCard.module.scss';

export interface TourCardProps {
    hotel: Hotel;
    price: PriceOffer;
    onOpenPrice: (priceId: string) => void;
}

export function TourCard({ hotel, price, onOpenPrice }: TourCardProps) {
    const handleClick = () => {
        onOpenPrice(price.id);
    };

    return (
        <article className={styles.card} aria-labelledby={`hotel-${hotel.id}`}>
            <div className={styles.card__image}>
                <img src={hotel.img} alt={`${hotel.name} hotel exterior`} />
            </div>

            <div className={styles.card__content}>
                <h3 id={`hotel-${hotel.id}`} className={styles.card__title}>
                    {hotel.name}
                </h3>

                <div className={styles.card__location}>
                    <img
                        src={getCountryFlagUrl(hotel.countryId)}
                        alt={`${hotel.countryName} flag`}
                        className={styles.card__flag}
                    />
                    <span className={styles.card__city}>
            {hotel.cityName}, {hotel.countryName}
          </span>
                </div>

                <div className={styles.card__info}>
                    <div className={styles.card__date}>
                        <span className={styles.card__label}>Start date:</span>
                        <span className={styles.card__value}>
              {new Date(price.startDate).toLocaleDateString('uk-UA')}
            </span>
                    </div>

                    <div className={styles.card__price}>
            <span className={styles.card__amount} aria-label={`Price: ${price.amount} US dollars`}>
              ${price.amount.toLocaleString()}
            </span>
                        <span className={styles.card__currency} aria-hidden="true">USD</span>
                    </div>
                </div>

                <Button
                    variant="primary"
                    fullWidth
                    onClick={handleClick}
                    className={styles.card__button}
                    aria-label={`View price details for ${hotel.name}`}
                >
                    Open Price
                </Button>
            </div>
        </article>
    );
}