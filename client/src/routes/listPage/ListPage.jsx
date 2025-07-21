import "./listPage.scss";
import Filter from "../../components/filter/filter";
import Card from "../../components/card/card";
import Map from "../../components/map/map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading posts...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts! Please try refreshing the page.</p>}
            >
              {(postResponse) => {
                console.log("Post response data:", postResponse);

                if (!postResponse.data || postResponse.data.length === 0) {
                  return (
                    <div className="no-posts-message">
                      <p>No properties found matching your criteria.</p>
                      <p>Try adjusting your search filters or create a new post.</p>
                    </div>
                  );
                }

                return postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ));
              }}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading map...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading map! Please try refreshing the page.</p>}
          >
            {(postResponse) => {
              if (!postResponse.data || postResponse.data.length === 0) {
                return <div className="empty-map">No properties to display on map</div>;
              }
              return <Map items={postResponse.data} />;
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;